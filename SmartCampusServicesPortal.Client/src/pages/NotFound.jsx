import SearchOffIcon from '@mui/icons-material/SearchOff';
import { FlexboxGrid, Col, Card, VStack } from 'rsuite';

function NotFound() {
    return (
        <FlexboxGrid justify="center" className={'container-content'}>
            <FlexboxGrid.Item as={Col} colspan={22} md={12} lg={10} xl={8}>
                <Card bordered={false} className="responsive-card">
                    <SearchOffIcon sx={{ fontSize: 150 }} />
                    <VStack spacing={2} align="center">
                        <Card.Header style={{ alignSelf: 'center'}} as="h5">Not Found page</Card.Header>
                        <Card.Body>
                            The page you tried to access doesn't exist.
                        </Card.Body>
                    </VStack>
                </Card>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default NotFound