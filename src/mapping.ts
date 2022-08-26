import {
    Transfer as TransferEvent,
} from '../generated/SinglePageRandomPack/SinglePageRandomPack';
import {Pack as PackEvent} from '../generated/Pack/SinglePagePacks';
import {
    Transfer,
    StickerPack, Player,
} from '../generated/schema';
import {Address, BigInt} from '@graphprotocol/graph-ts';

export function handleTransfer(event: TransferEvent): void {
    let entity = new Transfer(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    );
    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.tokenId = event.params.tokenId;
    if (Address.fromBytes(entity.from) == Address.zero()) {
        const stickerPack = new StickerPack(
            event.params.tokenId.toHex() + '-pack',
        );
        stickerPack.owner = entity.to;
        stickerPack.pieces = [];
        stickerPack.save();
    }
    let player = Player.load(event.params.to)
    if (player == null) {
        player = new Player(event.params.to)
        player.save()
    }

    entity.save();
}

export function handlePack(event: PackEvent): void {
    let entity = StickerPack.load(
        event.params.tokenId.toHex() + '-pack'
    )!;
    entity.pieces = event.params.pieces;
    entity.save()
}
