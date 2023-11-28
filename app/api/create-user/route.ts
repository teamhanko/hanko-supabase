import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request, res: Response) {
  try {
    const user = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let supauser;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
      }

      supauser = data;

      if (!supauser) {
        const { data, error } = await supabase
          .from("users")
          .insert([{ user_id: user.id, email: user.email }]);

        if (error) {
          console.error(error);
        }

        supauser = data;
      }
    } catch (error) {
      console.error(error);
    }

    const user_data = {
      ...user,
      id: supauser?.id,
    };

    return new NextResponse(JSON.stringify(user_data), { status: 200 });
  } catch (error) {
    console.error("[CREATEUSER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
