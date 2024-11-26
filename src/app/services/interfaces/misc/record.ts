export interface RecordFields<Tid> { //interface que manejara los datos primordiales
    id?: Tid,
    CreatedAt: Date;
    UpdatedAt: Date;
}

export type RowRecord<Tid , TRecord > = TRecord & RecordFields<Tid>;