import { Optional } from '@nestjs/common';

export class UpdateProjectDto {
    @Optional()
    tags: string[];
}