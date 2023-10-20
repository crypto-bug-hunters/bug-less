"use client";
import {
    Box,
    Button,
    Center,
    Group,
    NumberInput,
    Stack,
    TextInput,
    useMantineTheme,
    Title,
    Text
} from "@mantine/core";
import { FC, useState } from "react";
import { Address, parseEther } from "viem";
import { AddSponsorship } from "../../../../model/inputs";
import { usePrepareAddSponsorship } from "../../../../hooks/bugless";
import { useEtherPortalDepositEther } from "../../../../hooks/contracts";
import { useWaitForTransaction } from "wagmi";

import { BountyParams, InvalidBountyId } from "../utils.tsx";

const toWei = (input: string | number) => {
    if (typeof input == "number") {
        return BigInt(input * 1e18);
    } else {
        return parseEther(input);
    }
};

const AddSponsorshipPage: FC<BountyParams> = ({ params: { bountyId } }) => {
    const dapp = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;
    const theme = useMantineTheme();

    const bountyIndex = Number(bountyId);

    if (isNaN(bountyIndex)) {
        return <InvalidBountyId />;
    }

    const [name, setName] = useState("");
    const [imgLink, setImgLink] = useState("");
    const [value, setValue] = useState(0);

    const addSponsorship = {
        Name: name,
        ImgLink: imgLink,
        BountyIndex: bountyIndex,
    } as AddSponsorship;

    const config = usePrepareAddSponsorship(addSponsorship, toWei(value));

    const { data, write } =
        useEtherPortalDepositEther(config);
    const {isLoading, isSuccess,} = useWaitForTransaction({hash:data?.hash});

    
    function wrapSetter(setter) {
        return (e) => setter(e.target.value);
    }

    return (
        <Center>
            <Box p={20} mt={50} bg={theme.colors.dark[7]}>
                <Stack w={600}>
                    <Title>Sponsor a bounty</Title>
                    <TextInput
                        withAsterisk
                        size="lg"
                        label="Your name"
                        value={name}
                        placeholder="Satoshi Nakamoto"
                        onChange={wrapSetter(setName)}
                    />
                    <TextInput
                        size="lg"
                        label="Your avatar link"
                        value={imgLink}
                        placeholder="https://"
                        onChange={wrapSetter(setImgLink)}
                    />
                    <NumberInput
                        withAsterisk
                        size="lg"
                        label="Value"
                        suffix=" ETH"
                        allowNegative={false}
                        decimalScale={18}
                        value={value}
                        onChange={setValue}
                    />

                    <Group justify="center" mt="md">
                        <Button
                            size="lg"
                            type="submit"
                            disabled={!write || isLoading || name.trim().length === 0}
                            onClick={write}
                        >
                            {isLoading? "Adding Sponsorhsip...":"Add Sponsorship"}
                        </Button>
                    </Group>
                    {isSuccess && <>
                        <Group justify="center">
                            <Text size="lg">Sponsorship Successfully Added!</Text>
                        </Group>
                    </>}
                </Stack>
            </Box>
        </Center>
    );
};

export default AddSponsorshipPage;
