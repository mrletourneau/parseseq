# DrumParse
*~~A drum sequencer for nerds~~*

*Drum sequencers are for nerds*

### Sounds
The fundemental building blocks of a sequence

| Character | Sound           |
|-----------|-----------------|
| `k`       | 909 kick        |
| `h`       | 909 hh          |
| `c`       | 909 clap        |
| `1`       | G minor 7 chord |
| `2`       | A minor 7 chord |
| `3`       | D minor 7 chord |

### Functions

`+` Make sound louder

`-` Make sound quieter

`~n` "Ratchet" (divide) a beat into *n* beats. Defaults to a triplet

Example: ```~2h``` will play two hihat samples as 32nd notes on a step

`<` will nudge a beat back slightly

Example: ```<<<c``` nudges a clap behind the beat

`>` will nudge a beat forward slightly

`(abc)` group samples `a`, `b`, & `c`

Example: ```++(kc)``` will make a kick and clap extra loud

