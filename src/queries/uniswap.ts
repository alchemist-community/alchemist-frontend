import { gql } from "@apollo/client";

export const GET_UNISWAP_MINTS = gql`
  query getUserMints($userAddress: String!) {
    mints(
      where: {
        to: $userAddress
        pair: "0xcd6bcca48069f8588780dfa274960f15685aee0e"
      }
    ) {
      id
      timestamp
      transaction {
        id
      }
      amount0
      amount1
      pair {
        id
        token0 {
          id
          symbol
          derivedETH
        }
        token1 {
          id
          symbol
          derivedETH
        }
      }
      amountUSD
    }
  }
`;

export const GET_PRICES = gql`
  query getPrices($beforeTimestamp: Int!, $afterTimestamp: Int!) {
    wethPriceUSD: tokenDayDatas(
      where: {
        date_lt: $beforeTimestamp
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        date_gt: $afterTimestamp
      }
    ) {
      id
      date
      priceUSD
    }
    mistPriceUSD: tokenDayDatas(
      where: {
        token: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab"
        date_lt: $beforeTimestamp
        date_gt: $afterTimestamp
      }
    ) {
      id
      date
      priceUSD
    }
  }
`;
// gql`
// query getPrices{
//       pairHourDatas(
//         where: {
//           pair: 0xcd6bcca48069f8588780dfa274960f15685aee0e
//           hourStartUnix_lt: 1613653200
//           hourStartUnix_gt: 1613649600
//         }
//       ) {
//         id
//         reserve0
//         reserve1
//         hourStartUnix
//         reserveUSD
//       }
//     )
// `

export const createPairHistoryQuery = (
  address: string,
  timestamps: number[]
) => {
  let queryString = ``;
  timestamps.map((timestamp, i) => {
    queryString += `
      pairHour${i}: pairHourDatas(
        where: {
          pair: "${address}"
          hourStartUnix_lte: ${timestamp}
          hourStartUnix_gte: ${timestamp - 3600}
        }
      ) {
        id
        reserve0
        reserve1
        hourStartUnix
        reserveUSD
        pair {
          totalSupply
        }
      }
      pairDay${i}: pairDayDatas(
        where: {
          pairAddress:"0xcd6bcca48069f8588780dfa274960f15685aee0e", 
          date_lte:${timestamp}
          date_gte:${timestamp - 3600 * 24} 
        }){
          totalSupply
          reserve0
          reserve1
      }
    `;
  });
  let wrappedQuery = `query getPrices{${queryString}}`;
  // console.log(wrappedQuery);
  return gql`
    ${wrappedQuery}
  `;
};

// {
//   liquidityPositions(id: "0x365595AB460cB664c77d4e038c9051f09D781065-0xcd6bcca48069f8588780dfa274960f15685aee0e") {
//     id
//     user{
//       id
//     }
//     liquidityTokenBalance
//   }
// }

// {
//   pairDayDatas (where: {pairAddress: "0xcd6bcca48069f8588780dfa274960f15685aee0e", }){
//     id
//     pairAddress
//     reserve0
//     reserve1
//     reserveUSD
//     totalSupply
//     token0{
//       id
//     }
//     token1{
//       id
//     }
//   }
// }

// pairHourDatas(where:{pair:"0xcd6bcca48069f8588780dfa274960f15685aee0e"} ){
//   id
//   reserve0
//   reserve1
//   hourStartUnix
//   reserveUSD
// }

// pairHourDatas(where:{
//   pair:"0xcd6bcca48069f8588780dfa274960f15685aee0e"
//   hourStartUnix_gt: 1613653200
//   hourStartUnix_lt: 1613658200
// } ){
//   id
//   reserve0
//   reserve1
//   hourStartUnix
//   reserveUSD
// }
