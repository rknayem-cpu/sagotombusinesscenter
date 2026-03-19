import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

title:{
type:String,

},
bio:{
type:String,

},
imgUrl:{
type:String,
},
imgUrl2:{
type:String,
},
size:{
type:String,
},
category:{
type:String,
}
price:{
type:Number,
},


})


const Post = mongoose.models.Post || mongoose.model('Post',postSchema)

export default Post;