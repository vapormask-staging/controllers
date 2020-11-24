import { SinonStub, stub } from 'sinon';
import AssetsContractController from '../src/assets/AssetsContractController';
import AssetsController from '../src/assets/AssetsController';
import CurrencyRateController from '../src/assets/CurrencyRateController';
import TokenRatesController from '../src/assets/TokenRatesController';
import ComposableController from '../src/ComposableController';
import NetworkController from '../src/network/NetworkController';
import SwapsController from '../src/swaps/SwapsController';
import { SwapsError } from '../src/swaps/SwapsInterfaces';
import PreferencesController from '../src/user/PreferencesController';

const HttpProvider = require('ethjs-provider-http');
const swapsUtil = require('../src/swaps/SwapsUtil');
const util = require('../src/util');

const API_TOKENS = [
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    decimals: 18,
    occurances: 30,
    iconUrl: 'https://cloudflare-ipfs.com/ipfs/QmNYVMm3iC7HEoxfvxsZbRoapdjDHj9EREFac4BPeVphSJ',
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    decimals: 6,
    occurances: 30,
    iconUrl: 'https://cloudflare-ipfs.com/ipfs/QmR3TGmDDdmid99ExTHwPiKro4njZhSidbjcTbSrS5rHnq',
  },
  {
    address: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    symbol: 'PAX',
    decimals: 18,
    occurances: 30,
    iconUrl: 'https://cloudflare-ipfs.com/ipfs/QmQTzo6Ecdn54x7NafwegjLetAnno1ATL9Y8M3PcVXGVhR',
  },
];

const API_TRADES = {
  totle: {
    trade: null,
    sourceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    destinationToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    sourceAmount: '10000000000000000',
    destinationAmount: null,
    error: 'Error fetching totle trade: Gas estimation failed.',
    approvalNeeded: {
      data:
        '0x095ea7b3000000000000000000000000881d40237659c251811cec9c364ef91dc08d300c0000000000000000000000000000000000000000004a817c7ffffffdabf41c00',
      to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      value: '0',
      from: '0xb0da5965d43369968574d399dbe6374683773a65',
    },
    maxGas: 2270000,
    averageGas: 583863,
    estimatedRefund: 38540,
    fetchTime: 543,
    aggregator: 'totle',
    aggType: 'AGG',
    fee: 0.875,
    gasMultiplier: 1.5,
    priceSlippage: { ratio: 1, calculationError: 'No trade data to calculate price slippage', bucket: 'low' },
  },
  paraswap: {
    trade: {
      data:
        '0x5f5755290000000000000000000000000000000000000000000000000000000000000080000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000a70617261737761705632000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000780000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000005908bf000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000006c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000005908c000000000000000000000000000000000000000000000000000000000005c97e80000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000068000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000c9eeed34a6e0edb7f32cffd1d12e625564db9e83000000000000000000000000080bf510fcbf18b91105470639e9561022937712000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000002c00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000056178a0d5f301baf6cf3e1cd53d9863437345bf9000000000000000000000000c9eeed34a6e0edb7f32cffd1d12e625564db9e8300000000000000000000000055662e225a3376759c24331a9aed764f8f0c9fbb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c97e8000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005fbc4b5f000000000000000000000000000000000000000000000000164a480bf71de3ba000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000024f47261b0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000421cbe650637ba43625e3c4b021bba38856e0c948a1b7e69cb81923d421b6c6a0e317574e8ca0898f24cc10b4ac769c5a9e67ed422e79882105d369da8cf35af29b00300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000086d6574616d61736b000000000000000000000000000000000000000000000000',
      from: '0xb0da5965d43369968574d399dbe6374683773a65',
      value: '0',
      to: '0x881D40237659C251811CEC9c364ef91dC08D300C',
      gas: 2750000,
    },
    sourceAmount: '10000000000000000',
    destinationAmount: '6015406',
    error: null,
    sourceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    destinationToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    approvalNeeded: {
      data:
        '0x095ea7b3000000000000000000000000881d40237659c251811cec9c364ef91dc08d300c0000000000000000000000000000000000000000004a817c7ffffffdabf41c00',
      to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      value: '0',
      from: '0xb0da5965d43369968574d399dbe6374683773a65',
    },
    maxGas: 2750000,
    averageGas: 637198,
    estimatedRefund: 665220,
    fetchTime: 6239,
    aggregator: 'paraswap',
    aggType: 'AGG',
    fee: 0.875,
    gasMultiplier: 1.5,
    priceSlippage: { ratio: 1.0095049985488103, calculationError: '', bucket: 'low' },
  },
  oneInch: {
    trade: {
      data:
        '0x5f5755290000000000000000000000000000000000000000000000000000000000000080000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000076f6e65496e63680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010c0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000000595c0000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000001000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000000595c0000000000000000000000000000000000000000000000000000000000005c1f8200000000000000000000000011ededebf63bef0ea2d2d071bdf88f71543ec6fb000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000000000000000000000000000000000000000000f200000000000000000000000000000000000000000000000000000000000000fa00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000728bbe9bbee3af78ad611315076621865950b3440000000000000000000000000000000000000000000000000000000000000d48a9059cbb000000000000000000000000728bbe9bbee3af78ad611315076621865950b344000000000000000000000000000000000000000000000000002386f26fc10000e6adce0b0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000728bbe9bbee3af78ad611315076621865950b34400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000c04c2239eb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000b84f4e3b2ed00000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000005c1f8200000000000000000000000011ededebf63bef0ea2d2d071bdf88f71543ec6fb000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000728bbe9bbee3af78ad611315076621865950b344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000006a0000000000000000000000000728bbe9bbee3af78ad611315076621865950b34400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000064d1660f99000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000011ededebf63bef0ea2d2d071bdf88f71543ec6fb00000000000000000000000000000000000000000000000000004f94ae6af80000000000000000000000000000000000000000000000000000000000000000000000000000000000728bbe9bbee3af78ad611315076621865950b34400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000018455b181bb00000000000000000000000000000000000000000000000000000000000000808000000000000000000000000000000000000000000000000000000000000004000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000032000000000000000000000000000000320000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000242e1a7d4d00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000728bbe9bbee3af78ad611315076621865950b34400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000001a455b181bb00000000000000000000000000000000000000000000000000000000000000804000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000280000000000000000000000000000002800000000000000000000000097dec872013f6b5fb443861090ad93154287812600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000044f39b5b9b0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000005fbd9c450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000728bbe9bbee3af78ad611315076621865950b34400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000024476a612750000000000000000000000000000000000000000000000000000000000000080800000000000000000000000000000000000000000000000000000000000004400000000000000000000000011cbb51eb0af993e70394272c177ae657820a65000000000000000000000000000000000000000000000000000000000000001c0000000000000000000000000728bbe9bbee3af78ad611315076621865950b34400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000064d1660f99000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000068a17b587caf4f9329f0e372e3a78d23a46de6b5000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004470bdb947000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000005c1f82000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000440000000000000000000000000000000000000000000000000000000000000d48000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      from: '0xb0da5965d43369968574d399dbe6374683773a65',
      value: '0',
      to: '0x881D40237659C251811CEC9c364ef91dC08D300C',
      gas: 2530000,
    },
    sourceAmount: '10000000000000000',
    destinationAmount: '6037378',
    error: null,
    sourceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    destinationToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    approvalNeeded: {
      data:
        '0x095ea7b3000000000000000000000000881d40237659c251811cec9c364ef91dc08d300c0000000000000000000000000000000000000000004a817c7ffffffdabf41c00',
      to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      value: '0',
      from: '0xb0da5965d43369968574d399dbe6374683773a65',
    },
    maxGas: 2530000,
    averageGas: 929497,
    estimatedRefund: 800430,
    fetchTime: 2656,
    aggregator: 'oneInch',
    aggType: 'AGG',
    fee: 0.875,
    gasMultiplier: 1.5,
    priceSlippage: { ratio: 1.0058310785411322, calculationError: '', bucket: 'low' },
  },
  pmm: {
    trade: {
      data:
        '0x5f5755290000000000000000000000000000000000000000000000000000000000000080000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000003706d6d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000000591110000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000003200000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000056178a0d5f301baf6cf3e1cd53d9863437345bf900000000000000000000000074de5d4fcbf63e00296fd95d33236b979401663100000000000000000000000055662e225a3376759c24331a9aed764f8f0c9fbb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005bd240000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005fbc4b59000000000000000000000000000000000000000000000000164a480aa137afb4000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000024f47261b0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000421b4330b4d9789661eaab3294bfe913a505ce47d616479d4ab03832cc4635264b993272de3b344a1a4bf4e3a16a6971b727ba3a8d9e691ad2435c203be04fe3adab03000000000000000000000000000000000000000000000000000000000000',
      from: '0xb0da5965d43369968574d399dbe6374683773a65',
      value: '0',
      to: '0x881D40237659C251811CEC9c364ef91dC08D300C',
      gas: 405000,
    },
    sourceAmount: '10000000000000000',
    destinationAmount: '6017600',
    error: null,
    sourceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    destinationToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    approvalNeeded: {
      data:
        '0x095ea7b3000000000000000000000000881d40237659c251811cec9c364ef91dc08d300c0000000000000000000000000000000000000000004a817c7ffffffdabf41c00',
      to: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      value: '0',
      from: '0xb0da5965d43369968574d399dbe6374683773a65',
    },
    maxGas: 405000,
    averageGas: 209421,
    estimatedRefund: 18205,
    fetchTime: 852,
    aggregator: 'pmm',
    aggType: 'RFQ',
    fee: 0.875,
    gasMultiplier: 1.5,
    priceSlippage: { ratio: 1.0091369358715276, calculationError: '', bucket: 'low' },
  },
};

const mockFlags: { [key: string]: any } = {
  estimateGas: null,
};

jest.mock('eth-query', () =>
  jest.fn().mockImplementation(() => {
    return {
      estimateGas: (_transaction: any, callback: any) => {
        if (mockFlags.estimateGas) {
          callback(new Error(mockFlags.estimateGas));
          return;
        }
        callback(undefined, '0x0');
      },
      gasPrice: (callback: any) => {
        callback(undefined, '0x0');
      },
      getBlockByNumber: (_blocknumber: any, _fetchTxs: boolean, callback: any) => {
        callback(undefined, { gasLimit: '0x0' });
      },
      getCode: (_to: any, callback: any) => {
        callback(undefined, '0x0');
      },
      getTransactionByHash: (_hash: any, callback: any) => {
        callback(undefined, { blockNumber: '0x1' });
      },
      getTransactionCount: (_from: any, _to: any, callback: any) => {
        callback(undefined, '0x0');
      },
      sendRawTransaction: (_transaction: any, callback: any) => {
        callback(undefined, '1337');
      },
    };
  }),
);

jest.mock('web3', () =>
  jest.fn().mockImplementation(() => {
    return {
      eth: {
        contract: () => {
          return {
            at: () => {
              return {
                allowance: (_: string, callback: any) => callback(undefined, 1),
              };
            },
          };
        },
      },
    };
  }),
);

describe('SwapsController', () => {
  let swapsController: SwapsController;
  let networkController: NetworkController;
  let tokenRatesController: TokenRatesController;
  let assetsController: AssetsController;
  let currencyRateController: CurrencyRateController;
  let assetsContractController: AssetsContractController;
  let preferencesController: PreferencesController;
  let swapsUtilFetchTokens: SinonStub;
  let fetchTradesInfo: SinonStub;
  let estimateGas: SinonStub;
  beforeEach(() => {
    swapsUtilFetchTokens = stub(swapsUtil, 'fetchTokens').returns([]);
    fetchTradesInfo = stub(swapsUtil, 'fetchTradesInfo').returns(API_TRADES);
    estimateGas = stub(util, 'estimateGas').returns(
      new Promise((resolve) => resolve({ gas: '0x5208', gasPrice: '0x5208' })),
    );
    swapsController = new SwapsController({ quotePollingInterval: 10 });
    networkController = new NetworkController();
    tokenRatesController = new TokenRatesController();
    assetsController = new AssetsController();
    currencyRateController = new CurrencyRateController();
    assetsContractController = new AssetsContractController();
    preferencesController = new PreferencesController();
    new ComposableController([
      swapsController,
      networkController,
      tokenRatesController,
      assetsController,
      currencyRateController,
      assetsContractController,
      preferencesController,
    ]);
  });

  afterEach(() => {
    swapsUtilFetchTokens.restore();
    fetchTradesInfo.restore();
    estimateGas.restore();
  });

  it('should set default config', () => {
    expect(swapsController.config).toEqual({
      maxGasLimit: 2500000,
      pollCountLimit: 3,
      metaSwapAddress: '0x881d40237659c251811cec9c364ef91dc08d300c',
      fetchTokensThreshold: 86400000,
      quotePollingInterval: 10,
    });
  });

  it('should set default state', () => {
    expect(swapsController.state).toEqual({
      quotes: {},
      fetchParams: {
        slippage: 0,
        sourceToken: '',
        sourceAmount: 0,
        destinationToken: '',
        fromAddress: '',
        metaData: {
          sourceTokenInfo: {
            decimals: 0,
            address: '',
            symbol: '',
          },
          destinationTokenInfo: {
            decimals: 0,
            address: '',
            symbol: '',
          },
          accountBalance: '0x',
        },
      },
      tokens: null,
      quotesLastFetched: 0,
      errorKey: null,
      topAggId: null,
      swapsFeatureIsLive: false,
      tokensLastFetched: 0,
    });
  });

  it('should set tokens', () => {
    swapsController.setSwapsTokens(API_TOKENS);
    expect(swapsController.state.tokens).toEqual(API_TOKENS);
  });

  it('should set error key', () => {
    swapsController.setSwapsErrorKey(SwapsError.ERROR_FETCHING_QUOTES);
    expect(swapsController.state.errorKey).toEqual(SwapsError.ERROR_FETCHING_QUOTES);
  });

  it('should set quotes last fetched', () => {
    swapsController.setQuotesLastFetched(123);
    expect(swapsController.state.quotesLastFetched).toEqual(123);
  });

  it('should set swaps liveness', () => {
    swapsController.setSwapsLiveness(true);
    expect(swapsController.state.swapsFeatureIsLive).toEqual(true);
  });

  it('should call poll', () => {
    return new Promise((resolve) => {
      const poll = stub(swapsController, 'fetchAndSetQuotes');
      swapsController.pollForNewQuotes();
      expect(poll.called).toBe(true);
      expect(poll.calledTwice).toBe(false);
      setTimeout(() => {
        expect(poll.calledTwice).toBe(true);
        swapsController.stopPollingForQuotes();
        resolve();
      }, 11);
    });
  });

  it('should stop polling', () => {
    return new Promise((resolve) => {
      const poll = stub(swapsController, 'fetchAndSetQuotes');
      swapsController.pollForNewQuotes();
      expect(poll.called).toBe(true);
      expect(poll.calledTwice).toBe(false);
      setTimeout(() => {
        expect(poll.calledTwice).toBe(true);
        swapsController.stopPollingForQuotes();
        setTimeout(() => {
          expect(poll.calledThrice).toBe(false);
        }, 11);
        resolve();
      }, 11);
    });
  });

  it('should fetch tokens when no tokens in state', () => {
    return new Promise(async (resolve) => {
      swapsController.state.tokens = null;
      await swapsController.fetchTokenWithCache();
      expect(swapsUtilFetchTokens.called).toBe(true);
      resolve();
    });
  });

  it('should fetch tokens when no threshold reached', () => {
    return new Promise(async (resolve) => {
      swapsController.state.tokens = [];
      swapsController.state.tokensLastFetched = Date.now();
      await swapsController.fetchTokenWithCache();
      expect(swapsUtilFetchTokens.called).toBe(false);
      setTimeout(async () => {
        await swapsController.fetchTokenWithCache();
        expect(swapsUtilFetchTokens.called).toBe(true);
      }, 20);
      resolve();
    });
  });

  it('should not fetch tokens when no threshold reached or tokens are available', () => {
    return new Promise(async (resolve) => {
      swapsController.state.tokens = [];
      swapsController.state.tokensLastFetched = Date.now();
      await swapsController.fetchTokenWithCache();
      expect(swapsUtilFetchTokens.called).toBe(false);
      resolve();
    });
  });

  it('should refetch quotes', () => {
    return new Promise(async (resolve) => {
      const poll = stub(swapsController, 'fetchAndSetQuotes');
      await swapsController.safeRefetchQuotes();
      expect(poll.called).toBe(true);
      resolve();
    });
  });

  it('should fetch and set quotes', () => {
    const fetchParams = {
      slippage: 3,
      sourceToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      destinationToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      sourceAmount: 10000000000000000,
      fromAddress: '0xb0da5965d43369968574d399dbe6374683773a65',
      balanceError: undefined,
      metaData: {
        sourceTokenInfo: {
          address: '0x6b175474e89094c44da98b954eedeac495271d0f',
          symbol: 'DAI',
          decimals: 18,
          iconUrl: 'https://foo.bar/logo.png',
        },
        destinationTokenInfo: {
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC',
          decimals: 18,
        },
        accountBalance: '0x0',
      },
    };

    swapsController.configure({ provider: HttpProvider });
    return new Promise(async (resolve) => {
      const res = await swapsController.fetchAndSetQuotes(fetchParams, fetchParams.metaData);
      expect(res).toBeTruthy();
      expect(swapsController.state.quotes).toEqual(res && res[0]);
      expect(swapsController.state.topAggId).toEqual(res && res[1]);
      resolve();
    });
  });
});
