import Sight from "../models/sight.js";
import User from "../models/user.js";

//Toimii + testattu
export const deleteSight = async (sightId, userId) => {
    const sight = await Sight.deleteOne({ _id: sightId, user:userId});
    return sight
  };
  
  //Turha, hoidetaan frontin puolella
  export const findSights = async () => {
    const sights = await Sight.find({}).populate("user");
    return sights;
  };

  //Tätä ei oo implementoitu + eikä testattu/korjattu toimimaan oikeasti.
  export const addSight = async (data, userId) => {
    const sight = new Sight(data);
    //error test
    if (sight.destination === undefined) throw new Error("destination missing");
    if (sight.country === undefined) throw new Error("country missing");
    if (sight.city === undefined) throw new Error("city missing");
    if (sight.description === undefined) throw new Error("description missing");
    if (sight.picture === undefined) throw new Error("picture missing");

    const user = await User.findById(userId);
    sight.user = user.id;
    const result = await sight.save();
    user.sights = user.sights.concat(result.id);
    await user.save();
    return result;
  };
  
  //Tämä toimii
  export const updateSight = async (sightId, userId, data) => {
    //prettier-ignore
    const result = await Sight.findOneAndUpdate({ _id: sightId, user:userId }, data, { new:true })
    if (!result) throw new Error("Not Found");
    return result;
  };