import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tag } = body as { tag?: string };

        if (!tag) {
            return NextResponse.json(
                { success: false, message: "Missing tag parameter" },
                { status: 400 },
            );
        }

        revalidateTag(tag);

        return NextResponse.json({ success: true, revalidated: tag });
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid request" },
            { status: 400 },
        );
    }
}
