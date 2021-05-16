import { Box } from 'rebass';

export default function OrderStatus({ status }: { status: any }) {
  return (
    <Box
      minWidth={142}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        px: 3,
        py: 2,
        textAlign: 'center',
        textTransform: 'uppercase',
        borderColor: 'midDarkGrey',
        borderStyle: 'solid',
        borderWidth: '2px',
      }}
    >
      {status?.displayName ? status.displayName : null}
    </Box>
  );
}
