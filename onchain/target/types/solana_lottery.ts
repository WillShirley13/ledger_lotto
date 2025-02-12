/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_lottery.json`.
 */
export type SolanaLottery = {
  "address": "13pVhitZSHBdBGKUd36SP36mBomoDtwr1YKxqJA8ovG1",
  "metadata": {
    "name": "solanaLottery",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initLotteryVault",
      "discriminator": [
        101,
        153,
        54,
        52,
        237,
        248,
        69,
        16
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "lotteryVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121,
                  86,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initProtocolTreasury",
      "discriminator": [
        122,
        176,
        5,
        25,
        145,
        164,
        189,
        196
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocolTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "lotteryPayout",
      "discriminator": [
        164,
        125,
        132,
        212,
        154,
        9,
        250,
        137
      ],
      "accounts": [
        {
          "name": "lotteryVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121,
                  86,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "protocolTreasury"
          ]
        },
        {
          "name": "protocolTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "firstWinner",
          "writable": true,
          "optional": true
        },
        {
          "name": "secondWinner",
          "writable": true,
          "optional": true
        },
        {
          "name": "thirdWinner",
          "writable": true,
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "purchaseTicket",
      "discriminator": [
        90,
        91,
        173,
        20,
        72,
        109,
        15,
        146
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "lotteryVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121,
                  86,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "quantityOfTickets",
          "type": "u64"
        }
      ]
    },
    {
      "name": "reallocLotteryVault",
      "discriminator": [
        129,
        162,
        230,
        4,
        92,
        151,
        27,
        75
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "lotteryVault"
          ]
        },
        {
          "name": "lotteryVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121,
                  86,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "selectWinners",
      "discriminator": [
        80,
        100,
        28,
        131,
        83,
        199,
        222,
        80
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "lotteryVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  76,
                  111,
                  116,
                  116,
                  101,
                  114,
                  121,
                  86,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "winningNumbers",
          "type": {
            "array": [
              "u8",
              3
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lotteryVault",
      "discriminator": [
        113,
        236,
        25,
        110,
        31,
        177,
        53,
        85
      ]
    },
    {
      "name": "protocolTreasury",
      "discriminator": [
        162,
        26,
        123,
        61,
        102,
        146,
        47,
        73
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorisedSigner",
      "msg": "Unauthorized signer"
    },
    {
      "code": 6001,
      "name": "cannotReinitialise",
      "msg": "Cannot reinitialize the lottery vault or protocol treasury"
    },
    {
      "code": 6002,
      "name": "lotteryNotInProgress",
      "msg": "Lottery is not in progress"
    },
    {
      "code": 6003,
      "name": "lotteryNotFinished",
      "msg": "Lottery is not finished"
    },
    {
      "code": 6004,
      "name": "invalidWinner",
      "msg": "Invalid winner passed. Must match data held in LotteryVault"
    },
    {
      "code": 6005,
      "name": "insufficientFunds",
      "msg": "Insufficient funds to purchase tickets"
    },
    {
      "code": 6006,
      "name": "invalidTicketQuantity",
      "msg": "Invalid ticket quantity. Must be between 1 and 10. Total tickets per player is capped at 10"
    },
    {
      "code": 6007,
      "name": "numericOverflow",
      "msg": "Numeric overflow"
    },
    {
      "code": 6008,
      "name": "prizePoolMismatch",
      "msg": "Prize pool does not match the sum of rewards and protocol revenue"
    }
  ],
  "types": [
    {
      "name": "lotteryStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "notStarted"
          },
          {
            "name": "inProgress"
          },
          {
            "name": "finished"
          }
        ]
      }
    },
    {
      "name": "lotteryVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "prizePool",
            "type": "u64"
          },
          {
            "name": "participants",
            "type": {
              "vec": {
                "defined": {
                  "name": "playerInfo"
                }
              }
            }
          },
          {
            "name": "maxParticipants",
            "type": "u64"
          },
          {
            "name": "totalTicketsSold",
            "type": "u64"
          },
          {
            "name": "nextTicketId",
            "type": "u8"
          },
          {
            "name": "latestLotoWinners",
            "type": {
              "defined": {
                "name": "recentWinners"
              }
            }
          },
          {
            "name": "startTime",
            "type": "u32"
          },
          {
            "name": "finishTime",
            "type": "u32"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "lotteryStatus"
              }
            }
          },
          {
            "name": "exists",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "playerInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "pubkey"
          },
          {
            "name": "ticketNumbers",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "protocolTreasury",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "revenue",
            "type": "u64"
          },
          {
            "name": "exists",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "recentWinners",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "firstPlace",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "firstPlaceAmount",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "secondPlace",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "secondPlaceAmount",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "thirdPlace",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "thirdPlaceAmount",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "authorityPubkey",
      "type": "pubkey",
      "value": "HSePyKSEBLs6F4F4G1z6P9nnqQpj6jBN6ScLSAmhygo"
    },
    {
      "name": "basisPoints",
      "type": "u64",
      "value": "10000"
    },
    {
      "name": "firstPlaceRewardBp",
      "type": "u64",
      "value": "5000"
    },
    {
      "name": "lamportsPerLotteryTicket",
      "type": "u64",
      "value": "10000000"
    },
    {
      "name": "lamportsPerSol",
      "type": "u64",
      "value": "1000000000"
    },
    {
      "name": "lotteryVaultMinBalance",
      "type": "u64",
      "value": "100000000"
    },
    {
      "name": "lotteryVaultSeed",
      "type": "bytes",
      "value": "[76, 111, 116, 116, 101, 114, 121, 86, 97, 117, 108, 116]"
    },
    {
      "name": "protocolRevenueShareBp",
      "type": "u64",
      "value": "500"
    },
    {
      "name": "protocolTreasurySeed",
      "type": "bytes",
      "value": "[80, 114, 111, 116, 111, 99, 111, 108, 84, 114, 101, 97, 115, 117, 114, 121]"
    },
    {
      "name": "secondsInAWeek",
      "type": "u32",
      "value": "604800"
    },
    {
      "name": "secondPlaceRewardBp",
      "type": "u64",
      "value": "3000"
    },
    {
      "name": "thirdPlaceRewardBp",
      "type": "u64",
      "value": "1500"
    }
  ]
};
