import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsPhoneNumber('FR', { message: 'Invalid telephone number' })
  telephone: string;
}