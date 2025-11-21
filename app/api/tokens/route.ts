import { NextRequest, NextResponse } from "next/server";
import { mockTokens } from "@/feature/token/mockData";
import { TokenColumn} from "@/feature/token/types";

export const Dynamic = 'force-dynamic';

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url);
    const column = searchParams.get('column') as TokenColumn | null;
    let data = mockTokens;
    if (column) {
        data = data.filter((token) => token.column === column);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({tokens: data}, {status: 200});
}