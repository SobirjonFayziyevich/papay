
const assert = require("assert");
const { shapeIntoMongooseObjectId, lookup_auth_member_following } = require("../lib/config");   // Product Schemani export qilib oldik.
const Definer = require("../lib/mistake");
const FollowModel = require("../schema/follow.model");
const MemberModel = require("../schema/member.model");



            // MANTIQ:
    // ProductServiceModel => ProductControllerga xizmat qiladi. C => M (product service model ) => SchemaModel (DATA BASE model);
    // SchemaModellar => Product Model Service un xizmat qiladigam model hisoblanadi.
    // Service Modellar => Product Controller un xizmat qiladigan model hisoblandai.

class Follow {
    constructor() {
        this.followModel = FollowModel;  // ProductModel classni hosil qilib (ProductModel)ga tenglashtirayopti.
        this.memberModel = MemberModel; 
}
async subscribeData(member, data) {
  try {
    console.log("***************:::",data);
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);
      // authenticed bulgan user va usha authenticed bulgan userni qaysi member_idga subscribe bulmoqchi bulmasa, keyingi prosessga utkazsin.
      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const member_data = await this.memberModel
      .findById({ _id: follow_id })
      .exec();
      assert.ok(member_data, Definer.general_err2);

      const result = await this.createSubscriptionData(
          follow_id,
          subscriber_id
          );
          assert.ok(result, Definer.general_err1);

          await this.modifyMemberFollowCounts(follow_id, 'subscriber_change', 1); // kimgadir follow qilayopman,
          await this.modifyMemberFollowCounts(subscriber_id, 'follow_change', 1); // men follow qilganlarimi sonini oshirishim.
          return true;
        } catch(err) {
          throw err;
    }
}

async createSubscriptionData(follow_id, subscriber_id) {
  try{
     const new_follow = new this.followModel({ 
         follow_id: follow_id, 
         subscriber_id: subscriber_id
        });

        return await new_follow.save(); // new_folowni save mathodi promise tashlaydi uni kutib turish lozim.
  } catch(mongo_err) {
      console.log(mongo_err);
      throw new Error(Definer.follow_err2);
  }

}
async modifyMemberFollowCounts(mb_id, type, modifier) {
    try {
       if(type === 'follow_change') {
         await this.memberModel
         .findByIdAndUpdate(
             {_id: mb_id},
             {$inc: {mb_follow_cnt: modifier } } ) // mb_follow_cnt ni modifier soniga oshir.
         .exec();
       } else if(type === 'subscriber_change') { // followerlarni subscribe sonini oshirishim kerak.
        await this.memberModel
        .findByIdAndUpdate(
            {_id: mb_id},
            {$inc: {mb_subscriber_cnt: modifier } } ) // mb_subscriber_cnt ni modifier soniga oshir.
        .exec();
       }
       
    } catch(err) {
      throw err;
    }
 }  
 
 async unsubscribeData(member, data) {
     try{
      const subscriber_id = shapeIntoMongooseObjectId(member._id);
      const follow_id = shapeIntoMongooseObjectId(data.mb_id);

      const result = await this.followModel.findOneAndDelete({
          follow_id: follow_id,
          subscriber_id: subscriber_id,
      });
      assert.ok(result, Definer.general_err1);
      await this.modifyMemberFollowCounts(follow_id, 'subscriber_change', -1);
      await this.modifyMemberFollowCounts(subscriber_id, ' follow_change', -1);

     return true;
    }catch(err) {
     throw err;
    }
  }
   
async getMemberFollowingsData(inquiry) {
    try {
      //  console.log("query:", inquiry);
       const subscriber_id = shapeIntoMongooseObjectId(inquiry.mb_id),
          page = inquiry.page * 1,
          limit = inquiry.limit * 1;
          
          const result = await this.followModel
          .aggregate([
              { $match: {subscriber_id: subscriber_id} },
              { $sort: {createdAt: -1 } }, //eng oxirgisini kursatsin
              { $skip: (page -1) * limit }, 
              { $limit: limit },
              { 
                $lookup: {
                  from: "members",
                  localField: "follow_id",
                  foreignField: "_id",
                  as: "follow_member_data",
                },
              },
              {$unwind: "$follow_member_data" },
          ])
          .exec();

        assert.ok(result, Definer.follow_err3);
        return result;
        } catch(err) {
          throw err;
    }
}

async getMemberFollowersData(member, inquiry) {
  try { 
    const follow_id = shapeIntoMongooseObjectId(inquiry.mb_id), //following qilgan odamlarni topmoqchimiz.
       page = inquiry.page * 1,
       limit = inquiry.limit * 1;

    let aggregateQuery = [
      { $match: {follow_id: follow_id } },
      { $sort: { createdAt: -1 } }, 
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'members',
          localField: 'subscriber_id',
          foreignField: '_id',
          as: "subscriber_member_data",
        },
      },

     { $unwind: "$subscriber_member_data" },
    ];
 // following followed back to subscriber
 if(member && member._id === inquiry.mb_id) { // agar member mavjud bulsa, authenticat user request qilayotgan bulsa,
      // req qilayotgan user uzining followerlar ruyxatini req qilayotgan bulsa...
      // console.log("PASSED");
      aggregateQuery.push(lookup_auth_member_following(follow_id, 'follows'));
      // lookup_auth_member_followingni aggregateQueryga push qilayopmiz.
  } 
    const result = await this.followModel
    .aggregate(aggregateQuery)
    .exec();

    assert.ok(result, Definer.follow_err3);
    return result;
  } catch(err) {
    throw err;
  }
 }
}
module.exports = Follow;