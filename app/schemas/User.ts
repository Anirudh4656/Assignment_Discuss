import mongoose,{Types} from "mongoose";
import { type BaseSchema } from "./index";
import bcrypt from "bcrypt";

export enum UserRole {
   
    USER = "USER",
    ADMIN = "ADMIN",
  }

  const Schema=mongoose.Schema;
  export interface IUser extends BaseSchema {
    save(): unknown;
    username:string,
    email:string;
    password:string;
    role:'user'|'admin';
    isBlocked:boolean;
  }

  export interface IReply extends BaseSchema {
    username:string,
    email:string;
    password:string;
    role:'user'|'admin';
    isBlocked:boolean;
  }
  export interface ILike extends BaseSchema {
    username:string,
    email:string;
    password:string;
    role:'user'|'admin';
    isBlocked:boolean;
  }
//uppercase error 2)userrole passs  ?
  const UserSchema=new Schema<IUser>(
    {
       username:{type:String,required:true,unique:true},
       password:{type: String, required: true},
       email:{type:String,required:true,unique:true},
       role:{type:String,enum:['user','admin'],default:'user'},
       isBlocked:{type:Boolean,default:false}
    }
  )
//   UserSchema.pre("save",async function(next)){

//   }

//discussion schema 
export interface IDiscuss extends BaseSchema{
  title:string,
 content:string,
 user:Types.ObjectId;
 isClosed:boolean,
 replies:IReply['_id'][],
 likes:ILike['_id'][],
 createdAt: Date,
  updatedAt: Date
}
const DiscussionSchema=new Schema<IDiscuss>(
  {
    title:{type:String,required:true},
    content:{type:String,required:true},
    user:{type:Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt:{type:Date,Default:Date.now},
    updatedAt:{type:Date,Default:Date.now},
    isClosed:{type:Boolean,default:false},
    replies:[{type:Schema.Types.ObjectId,ref:'Reply'}],
    likes:[{type:Schema.Types.ObjectId,ref:'Likes'}],

    
  }
)

const ReplySchema= new Schema({
  content:{type:String,required:true},
  user:{type:Schema.Types.ObjectId,ref:'User',required:true},
  discussion:{type:Schema.Types.ObjectId,ref:'Disscus', required:true},
  createdAt:{type:Date,default:Date.now}

})
//like Schema

const LikeSchema=new Schema({
  user:{type:Schema.Types.ObjectId,ref:'User'},
  discussion:{type:Schema.Types.ObjectId,ref:'Discuss'}
})
//in Services folder
UserSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
export const User = mongoose.model('User',UserSchema)
export const Discuss = mongoose.model('Discuss',DiscussionSchema)
export const Like = mongoose.model('Like',LikeSchema)
export const Reply = mongoose.model('Reply',ReplySchema)
// module.exports={ User,Discuss,Like,Reply};
// export default mongoose.model<IUser>('user',UserSchema);
