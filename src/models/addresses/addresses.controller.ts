import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../../../common/guards';

@Controller('v1/api/addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll() {
    return this.addressesService.findAll();
  }

  @Post()
  create(@Body() createAddressDto: any) {
    return this.addressesService.create(createAddressDto);
  }
}

