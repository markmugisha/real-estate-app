import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
username: {
    type: String,
    required: true,
    unique: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
},
avatar: {
    type: String,
    default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.deviantart.com%2Fthwaitesmtt%2Fart%2FKiri-Human-Version-Avatar-2-The-Way-Of-Water-950527483&psig=AOvVaw0fWg9TW4UWh7NuOCiv09qy&ust=1706024055131000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODu74up8YMDFQAAAAAdAAAAABAR"
},

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;