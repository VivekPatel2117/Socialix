import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export default function Spinner({ isSpinner, handleSpinner }: { isSpinner: boolean, handleSpinner: () => void }) {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isSpinner}
        onClick={()=>handleSpinner()}
      >
        <CircularProgress color="inherit" />
        <p>Processing...</p>
      </Backdrop>
    </div>
  );
}
