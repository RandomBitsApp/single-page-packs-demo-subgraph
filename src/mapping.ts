import {
    Transfer as TransferEvent,
} from '../generated/SinglePageRandomPack/SinglePageRandomPack';
import {Pack as PackEvent} from '../generated/Pack/SinglePagePacks';
import {
    Transfer,
    StickerPack,
} from '../generated/schema';
import {Address} from '@graphprotocol/graph-ts';

export function handleTransfer(event: TransferEvent): void {
    let entity = new Transfer(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    );
    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.tokenId = event.params.tokenId;
    if (Address.fromBytes(entity.from) == Address.zero()) {
        const reandomPack = new StickerPack(
            event.params.tokenId.toHex() + '-pack',
        );
        reandomPack.owner = entity.to;
        reandomPack.pieces = [];
    }
    entity.save();
}

export function handlePack(event: PackEvent): void {
    let entity = StickerPack.load(
        event.params.tokenId.toHex() + '-pack'
    )!;
    entity.pieces = event.params.pieces;
}
