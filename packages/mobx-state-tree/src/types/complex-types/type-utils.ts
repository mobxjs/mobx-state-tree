export type Suc<N extends number | never> = N extends never
    ? never
    : N extends 0
        ? 1
        : N extends 1
            ? 2
            : N extends 2
                ? 3
                : N extends 3
                    ? 4
                    : N extends 4
                        ? 5
                        : N extends 5
                            ? 6
                            : N extends 6
                                ? 7
                                : N extends 7 ? 8 : N extends 8 ? 9 : N extends 9 ? 10 : never
