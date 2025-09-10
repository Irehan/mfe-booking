
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/BookingList' | 'REMOTE_ALIAS_IDENTIFIER/BookingForm';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/BookingForm' ? typeof import('REMOTE_ALIAS_IDENTIFIER/BookingForm') :T extends 'REMOTE_ALIAS_IDENTIFIER/BookingList' ? typeof import('REMOTE_ALIAS_IDENTIFIER/BookingList') :any;