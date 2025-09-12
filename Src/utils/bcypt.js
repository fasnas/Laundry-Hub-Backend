import bcrypt from "bcrypt"

export const hashpassword=async(password)=>{
    try {
        return await bcrypt.hash(password,10)
    } catch (error) {
        console.log("error happened while hashing password",error)
    }
}

export const comparepassword=async(x,password)=>{
   try {
    return await bcrypt.compare(x,password)
   } catch (error) {
      console.log("error happened inside compare password")
   }
}

