
const assert = require("assert");
const {shapeIntoMongooseObjectId} = require("../lib/config");   // Product Schemani export qilib oldik.
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
   
}

module.exports = Follow;