import { PartialType } from "@nestjs/swagger";
import { CreateMetaIntermediaDto } from "./create-meta-intermedia.dto";

export class UpdateMetaIntermediaDto extends PartialType(CreateMetaIntermediaDto) {}

