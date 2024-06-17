import jwt from "jsonwebtoken";
import { User, type IUser } from '../schemas/User';
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';


export const initPassport=():void =>{
    //user login
    passport.use('signup',
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
      async(req,email,password,done)=>{
        try{
            const existingUser = await User.findOne({email})
            if(existingUser) {

                return done(null,false,{message:'Email already in use'});
            
            }
            const hashedPassword=await bcrypt.hash(password,10)
            const newUser:IUser= new User({userName:req.body.username,email,password:hashedPassword});
            await newUser.save();
            return done(null,newUser);
        } catch(error){
            return done(error)
        }
    }
        ) )};
        passport.use(
            "login", 
            new LocalStrategy({
                usernameField:'email',
                passwordField:'password',
            },
        async(email,password,done)=>{
            try{
                const user:IUser |null =await User.findOne({email});
                if(!user){
                    return done(null,false,{message:'no user'})
                }
                const isMatch= await bcrypt.compare(password,user.password)
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                  }
                //   if (user.blocked) {
                //     done(createError(401, "User is blocked, Contact to admin"), false);
                //     return;
                //   }
                //check from code
                  return done(null, user);
            }catch(error){
                return done(error);
            }
        }
        
        )
        )
    
    // passport.serializeUser((user: IUser, done) => {
    //     done(null, user.id);
    //   });
      
//       passport.deserializeUser(async (id, done) => {
//         try {
//           const user = await User.findById(id);
//           done(null, user);
//         } catch (error) {
//           done(error, null);
//         }
//       });
//     )
// }
// (user: Omit<IUser, "password">

export const createUserTokens=(user:{id:string,email:string})=>{
    const jwtSecret=process.env.JWT_SECRET ?? '';
    const token =jwt.sign(user,jwtSecret);
    return {accessToken:token,refreshToken:""}
}