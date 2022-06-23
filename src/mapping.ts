import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  Transfer as TransferEvent,
} from '../generated/SinglePageRandomPack/SinglePageRandomPack';
import { Pack as PackEvent } from '../generated/Pack/SinglePagePacks';
import { Approval, ApprovalForAll, Transfer, RandomPack } from '../generated/schema';
import { Address } from '@graphprotocol/graph-ts';

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(event.transaction.hash.toHex() + '-' + event.logIndex.toString());
  entity.owner = event.params.owner;
  entity.approved = event.params.approved;
  entity.tokenId = event.params.tokenId;
  entity.save();
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  );
  entity.owner = event.params.owner;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;
  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(event.transaction.hash.toHex() + '-' + event.logIndex.toString());
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;
  if (Address.fromBytes(entity.from) == Address.zero()) {
    const randomPack = new RandomPack(entity.tokenId.toHex());
    randomPack.owner = entity.to;
    randomPack.pieces = null;
    randomPack.save();
  }
  entity.save();
}

export function handlePack(event: PackEvent): void {
  let randomPack = RandomPack.load(event.params.tokenId.toHex());
  if (randomPack == null) {
    randomPack = new RandomPack(event.params.tokenId.toHex());
  }
  randomPack.pieces = event.params.pieces;
  randomPack.save();
}
