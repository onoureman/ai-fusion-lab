import { aj } from "@/config/Arcjet";
import { currentUser } from "@clerk/nextjs/server"
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req) {
    const user=await currentUser();
    const {token}=await req.json();

    if(token)
    {
        const decision = await aj.protect (req,{
        userId:user?.primaryEmailAddress.emailAddress,
        requested:token
    });
    if (decision,isDenied())
    {
        return NextResponse.json({
            error:"Too many Request",
            remaingToken:decision.reason.remaining
        }
        )
    }
      return NextResponse.json({allowed:true,remaingToken:decision.reason.remaining})
    }else{
    const decision = await aj.protect (req,{
        userId:user?.primaryEmailAddress.emailAddress,
        requested:0
    });
    console.log ("Arcjet decision", decision.reason.remaing);
    const remaingToken=decision.reason.remaining;

    return NextResponse.json({remaingToken:remaingToken})
    
}
}