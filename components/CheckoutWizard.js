import { Step, StepLabel, Stepper } from "@mui/material";



export default function CheckoutWizard({step = 0}) {

    return (
        <Stepper activeStep={step} alternativeLabel sx={{mt: 6}}>
            {['Connéxion', 'Adresse de livraison', 'Methode de payment', 'Passer la commande'].map(
                (step) => (
                    <Step key={step}>
                        <StepLabel>{step}</StepLabel>
                    </Step>
                )
            )}
        </Stepper>
    )
}
