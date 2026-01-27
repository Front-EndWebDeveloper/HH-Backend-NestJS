import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity({name:'addresses'})
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('street')
    street: string;

    @Column('city')
    city: string;

    @Column('state')
    state: string;

    @Column('zip_code')
    zipCode: string;

    @Column('country')
    country: string;

    @Column('user_id')
    userId: string;
}