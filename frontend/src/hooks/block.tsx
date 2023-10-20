
export function getBlockTimestamp() {
    const [block, setBlock] = useState<any>(null);

    useEffect(() => {
        async function fetchBlock() {
            try {
                setBlock(block);
            } catch (error) {
                console.error('Error fetching block:', error);
            }
        }

        fetchBlock();
    }, [client]);

    return block
}
