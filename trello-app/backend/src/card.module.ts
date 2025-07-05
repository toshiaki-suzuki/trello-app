import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardController } from './presentation/controllers/card.controller';
import { CardService } from './application/services/card.service';
import { TypeOrmCardRepository } from './infrastructure/repositories/card.repository';
import { CardEntity } from './infrastructure/entities/card.entity';
import { CardRepository } from './domain/repositories/card-repository.interface';
import { ListModule } from './list.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    ListModule
  ],
  controllers: [CardController],
  providers: [
    CardService,
    {
      provide: CardRepository,
      useClass: TypeOrmCardRepository,
    },
  ],
  exports: [CardService],
})
export class CardModule {}