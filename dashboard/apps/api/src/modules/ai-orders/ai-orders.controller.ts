import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Ip,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@auto-tags/shared-types';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AiOrdersService } from './ai-orders.service';
import { CreateAiOrderTaskDto } from './dto/create-ai-order-task.dto';
import { CreateOpenAiKeyDto, UpdateOpenAiKeyDto } from './dto/open-ai-key.dto';

@Controller('extension/tasks')
@Public()
export class ExtensionAiOrdersController {
  constructor(
    private readonly service: AiOrdersService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateAiOrderTaskDto,
    @Ip() ip: string,
    @Headers('x-extension-token') token?: string,
  ) {
    this.assertExtensionToken(token);
    return this.service.create(dto, ip);
  }

  @Get(':id')
  get(@Param('id') id: string, @Headers('x-extension-token') token?: string) {
    this.assertExtensionToken(token);
    return this.service.getPublic(id);
  }

  private assertExtensionToken(value?: string) {
    const expected = this.config.get<string>('EXTENSION_API_TOKEN');
    if (expected && value !== expected) throw new UnauthorizedException('Invalid extension token');
  }
}

@Controller('ai-orders')
export class AiOrdersController {
  constructor(private readonly service: AiOrdersService) {}

  @Get('overview')
  overview() {
    return this.service.overview();
  }

  @Get()
  list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    return this.service.list(page, pageSize);
  }

  @Get('keys')
  @Roles(UserRole.ADMIN)
  keys() {
    return this.service.listKeys();
  }

  @Post('keys')
  @Roles(UserRole.ADMIN)
  createKey(@Body() dto: CreateOpenAiKeyDto) {
    return this.service.createKey(dto);
  }

  @Patch('keys/:id')
  @Roles(UserRole.ADMIN)
  updateKey(@Param('id') id: string, @Body() dto: UpdateOpenAiKeyDto) {
    return this.service.updateKey(id, dto);
  }
}
