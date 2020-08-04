/* External Imports */
import { getLogger } from '@eth-optimism/core-utils'
import { Signer } from 'ethers'

/* Internal Imports */
import { AddressResolverMapping, RollupOptions } from './types'
import {
  GAS_METER_PARAMS,
  getL1ContractOwnerAddress,
  getL1DeploymentSigner,
  getL1SequencerAddress,
} from './config'
import { Environment } from './environment'
import { deployAllContracts } from './contract-deploy'

const log = getLogger('deploy-l1-rollup-contracts')

/**
 * Deploys all L1 contracts according to the environment variable configuration.
 * Please see README for more info.
 */
export const deployContracts = async (): Promise<AddressResolverMapping> => {
  let res: AddressResolverMapping
  try {
    const signer: Signer = getL1DeploymentSigner()
    const ownerAddress: string = await getL1ContractOwnerAddress()
    const sequencerAddress: string = getL1SequencerAddress()
    const rollupOptions: RollupOptions = {
      forceInclusionPeriodSeconds: Environment.forceInclusionPeriodSeconds(),
      ownerAddress,
      sequencerAddress,
      gasMeterConfig: GAS_METER_PARAMS
    }

    res = await deployAllContracts({
      signer,
      rollupOptions,
    })
  } catch (e) {
    log.error(`Error deploying contracts: ${e.message}`)
    return undefined
  }

  log.info(`\n\nSuccessfully deployed the following contracts:`)
  log.info(`\tAddressResolver: ${res.addressResolver.address}`)
  Object.keys(res.contracts).forEach((key) => {
    if (res.contracts[key]) {
      log.info(`\t${key}: ${res.contracts[key].address}`)
    }
  })
}