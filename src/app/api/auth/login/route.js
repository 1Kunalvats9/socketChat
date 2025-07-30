import prisma from "../../../../lib/prisma"
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req){
    try{
        const {email,password} = await req.json();
        const user = await prisma.user.findUnique({where:{email}})

        if(!user){
            return NextResponse.json({message:"Please sign up first", status:400})
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            return NextResponse.json({message:"credentials don't match", status:400})
        }

        const token = jwt.sign({userId:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn: '1d'});
        return NextResponse.json({message:"user logged in successsfully",token,email, status:200})
    }catch(err){
        console.log(err);
        return NextResponse.json({message:"Error in logging in",status:500})
    }
}