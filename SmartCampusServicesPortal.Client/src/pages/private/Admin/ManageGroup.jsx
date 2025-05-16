import  {useState, useEffect } from 'react';
import { decodeId } from '@/utils/hashHelper';
import { useParams } from 'react-router-dom';
import { userActions } from "@/utils/authEnums.jsx";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Checkbox, FormControlLabel, FormGroup , useMediaQuery, Divider} from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { useAdmin } from  "@/context/AdminContext.jsx";
import { useTheme } from '@mui/material/styles';
import { ButtonToolbar } from 'rsuite';
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import CustomButton from "@/components/CustomButton.jsx";
import ApiClient from "@/service/ApiClient.jsx";

const ManageGroup = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { viewGroup, getSystemPermission } = useAdmin();
    const [ selectedActions, setSelectedActions ] = useState([]);
    const { groupId } = useParams();
    const { canAccess } = useAuth();
    const [ group, setGroup ] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (groupId) {
                const decodedId = decodeId(groupId);
                const grp = viewGroup(decodedId);
                setGroup(grp);
                const response = await ApiClient.instance.getGroupActions(decodedId);
                setSelectedActions(response.map(r => r.actionId));
            }
        };

        fetchData();
    }, [groupId]);

    return (
       <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Admin', link: constantRoutes.protected.admin.index },
                            { label: 'Manage-users-groups', link: constantRoutes.protected.admin.manageUserAndGroups},
                            { label: 'View-Group', link: constantRoutes.protected.admin.viewGroup},
                        ]}
                    />
                }
                title={`Manage Group: ${group?.description}`}
                children={
                    <Box sx={{ width: '100%', mt:4 }}>
                        <Box sx={{border: '1px solid', p:1 }}>
                            <Typography variant={isMobile?'body1' :'h5'} sx={{ opacity: '0.5', }} color="text.secondary">
                                {'Group Name'}
                            </Typography>
                            <Typography variant={isMobile?'h6' :'h5'} sx={{ opacity: '0.5', mb:'1em' }} color="text.secondary">
                                {group?.description}
                            </Typography>

                            <Box>
                                <Typography variant={isMobile?'body1' :'h5'} sx={{ opacity: '0.5', }} color="text.secondary">
                                    {'Actions'}
                                </Typography>
                                 <FormGroup>
                                    {getSystemPermission.map((action) => (
                                    <FormControlLabel
                                        key={action.actionId}
                                        control={
                                        <Checkbox
                                            sx={{
                                                '&.Mui-checked': {
                                                color: '#008292',
                                                },
                                            }}
                                            checked={selectedActions.includes(action.actionId)}
                                            onChange={(e) => {
                                            const updated = e.target.checked
                                                ? [...selectedActions, action.actionId]
                                                : selectedActions.filter((id) => id !== action.actionId);
                                            setSelectedActions(updated);
                                            }}
                                        />
                                        }
                                        label={action.description}
                                    />
                                    ))}
                                </FormGroup>
                            </Box>
                            <Divider sx={{my: '2em'}} />
                             <ButtonToolbar  className="button-toolbar">
                                <CustomButton
                                    handle={()=> navigate(constantRoutes.protected.admin.manageUserAndGroups)}
                                    label={'Cancel'}
                                    variant={'contained'}
                                    color={'primary'}
                                />
                                {canAccess(userActions.REVOKE_ACTION_FROM_GROUP) && (                  
                                    <CustomButton
                                        handle={()=>{}}
                                        label={'Update'}
                                        variant={'contained'}
                                        color={'secondary'}
                                    />
                                )}
                            </ButtonToolbar>
                        </Box>
                    </Box>
                }

            />
        </Box>
    );
}

export default ManageGroup;