import mongoose,{Date, Types} from "mongoose";
import { type BaseSchema } from "./index";
import bcrypt from "bcrypt";

export enum UserRole {
   
    USER = "USER",
    ADMIN = "ADMIN",
  }

  const Schema=mongoose.Schema;
  export interface IUser extends BaseSchema {
    user:string;
    id: string;
    save(): unknown;
    username:string,
    email:string;
    password:string;
    role:UserRole;
    isBlocked:boolean;
  }
  export interface Reply{
    id: any;
    discussion:Types.ObjectId,
    user:Types.ObjectId,
    name:string,
    content:string,

  }
  export interface Like  {
    equals: any;
    user:Types.ObjectId,
   
  }
  export interface IReply{
    save(): unknown;
    id: any;
    discussion:Types.ObjectId,
    user:Types.ObjectId,
    name:string,
    content:string,
    replies:Reply[],
    likes:Like[]
  }
  export interface ILike  {
    user:Types.ObjectId,
    discussion:Types.ObjectId,
    reply:Types.ObjectId
  }
//uppercase error 2)userrole passs  ?
  const UserSchema=new Schema<IUser>(
    {
       username:{type:String,required:true,unique:true},
       password:{type: String, required: true},
       email:{type:String,required:true,unique:true},
       role:{type:String,enum:UserRole,default:UserRole.USER},
       isBlocked:{type:Boolean,default:false}
    }
  )

export interface IDiscuss extends BaseSchema{
  title:string,
 content:string,
 user:Types.ObjectId;
 isClosed:boolean,
 replies:IReply[],
 likes:ILike[],
 name:string

}
//will go for more optimal solution ,mp
const DiscussionSchema=new Schema<IDiscuss>(
  {
    title:{type:String,required:true},
    content:{type:String,required:true},
    user:{type:Schema.Types.ObjectId, ref: 'User', required: true },
    name:{type:String},
    createdAt:{type:Date,Default:Date.now},
    updatedAt:{type:Date,Default:Date.now},
    isClosed:{type:Boolean,default:false},
    replies:[{type:Schema.Types.ObjectId,ref:'Reply'}],
    likes:[{type:Schema.Types.ObjectId,ref:'Like'}],

    
  }
)

const ReplySchema= new Schema<IReply>({
  content:{type:String,required:true},
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
  user:{type:Schema.Types.ObjectId,ref:'User',required:true},
  discussion:{type:Schema.Types.ObjectId,ref:'Discuss', required:true},
  name:{type:String},
  likes:[{ type: Schema.Types.ObjectId, ref: 'Like' }]

})
//like Schema

const LikeSchema=new Schema<ILike >({
  user:{type:Schema.Types.ObjectId,ref:'User'},
  discussion:{type:Schema.Types.ObjectId,ref:'Discuss'},
  reply:{type: Schema.Types.ObjectId, ref: 'Reply'}
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
