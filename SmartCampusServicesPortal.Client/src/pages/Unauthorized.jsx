import LockOutlineIcon from '@mui/icons-material/LockOutline';
import { FlexboxGrid, Col, Card, VStack } from 'rsuite';
import CustomButton from "@/components/CustomButton.jsx";
function Unauthorized() {
    return (
        <FlexboxGrid justify="center" className={'container-content'}>
            <FlexboxGrid.Item as={Col} colspan={22} md={12} lg={10} xl={8}>
                <Card bordered={false} className="responsive-card">
                    <LockOutlineIcon sx={{ fontSize: 150 }} />
                    <VStack spacing={2} align="center">
                        <Card.Header style={{ alignSelf: 'center'}} as="h5">Unauthorised</Card.Header>
                        <Card.Body>
                            You don't have the right permissions to access this page. <br />

                            <CustomButton
                                handle={()=>window.location.href = '/'}
                                label={'Back to Home'}
                                color={'secondary'}
                            />
                        </Card.Body>
                    </VStack>
                </Card>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Unauthorized