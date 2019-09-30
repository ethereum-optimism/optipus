import {
  SignedTransaction,
  RollupBlock,
  RollupTransitionPosition,
  RollupTransition,
  RollupTransaction,
  FraudCheckResult,
  StateSnapshot,
} from './types'

export interface RollupStateGuard {
  /**
   * Gets the most recent transition and block number wich the guard has verified so far.
   *
   * @returns The RollupTransitionPosition up to which the guard has currently verified.
   */
  getCurrentVerifiedPosition(): Promise<RollupTransitionPosition>

  /**
   * Converts a transition into a transaction to be parsed by the transitioner.
   *
   * @returns The RollupTransitionPosition up to which the guard has currently verified.
   */
  getTransactionFromTransitionAndSnapshots(
    transition: RollupTransition,
    snapshots: StateSnapshot[]
  ): Promise<SignedTransaction>
  /**
   * Applies the next transition as a transaction to the rollup state machine.
   *
   * @param nextTransition The next transition which was rolled up.
   * @returns The FraudCheckResult resulting from the check
   */
  checkNextTransition(
    nextTransition: RollupTransition
  ): Promise<FraudCheckResult>

  /**
   * Checks a block of transitions once downloaded from ethereum
   *
   * @param nextBlock The block to be checked for fraud
   * @returns The FraudCheckResult resulting from the check
   */
  checkNextBlock(nextBlock: RollupBlock): Promise<FraudCheckResult>
}

export class LocalMachineError extends Error {
  constructor() {
    super(
      'Transaction application failed for a reason other than the tx being invalid!'
    )
  }
}

export class ValidationOutOfOrderError extends Error {
  constructor() {
    super(
      'Blocks were fed to the validator out of sync.'
    )
  }
}
