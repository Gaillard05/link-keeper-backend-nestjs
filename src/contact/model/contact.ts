import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('require')
  name: string;

  @Column('require')
  telephone: string;
}