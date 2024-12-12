export interface RecordFields { //interface que manejara los datos primordiales
    CreatedAt: Date;
    UpdatedAt: Date;
}

export type RowRecord<TRecord> = TRecord & RecordFields;