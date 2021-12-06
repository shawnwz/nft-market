import {Body, Controller, Get, Post, Route,} from "tsoa";
import {bulkMint, BulkMintParams} from "./imxService";

@Route("imx")
export class ImxController extends Controller {

    @Post("mint")
    public async mint(@Body() requestBody: BulkMintParams):Promise<void> {
        await bulkMint(requestBody);
    }

    @Get("hello")
    public hello(){
        return "hello";
    }
}
