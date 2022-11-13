import { alpha, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { FC } from 'react';
import HeadingWithLine from './HeadingWithLine';

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleDeletePersons: any;
  setIsAddToCommunityDialogOpen: any;
  setIsRemoveCommunityDialogOpen: any;
}

export const TableToolbar: FC<EnhancedTableToolbarProps> = ({
  numSelected,
  handleDeletePersons,
  setIsAddToCommunityDialogOpen,
  setIsRemoveCommunityDialogOpen,
}) => {
  return (
    <Toolbar
      sx={{
        marginTop: { xs: 2 },
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} valgt
        </Typography>
      ) : (
        <HeadingWithLine text="Administrer personer"></HeadingWithLine>
      )}
      {numSelected > 0 && (
        <>
          <Tooltip title="Delete selected">
            <IconButton onClick={handleDeletePersons}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add selected to group">
            <IconButton onClick={() => setIsAddToCommunityDialogOpen(true)}>
              <GroupAddIcon />
            </IconButton>
          </Tooltip>{' '}
          <Tooltip title="Delete selected from group">
            <IconButton onClick={() => setIsRemoveCommunityDialogOpen(true)}>
              <GroupRemoveIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Toolbar>
  );
};
