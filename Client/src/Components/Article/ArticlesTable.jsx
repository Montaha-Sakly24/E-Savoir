import React from "react";
import { FaEye, FaPaperPlane, FaCheck, FaTimes, FaEdit, FaTrash,  } from "react-icons/fa";
import PropTypes from "prop-types";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

// utils
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const getStatusColor = (status) => {
  const colors = {
    draft: 'default',
    pending: 'warning',
    published: 'success',
    rejected: 'error',
    amended: 'info'
  };
  return colors[status] || 'default';
};

// table header
function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, role }) {
  const headCells = [
    { id: "numericId", label: "#" },
    { id: "title", label: "Article Name" },
    { id: "categoryId", label: "Category" },
    ...(role === "admin" ? [{ id: "userId", label: "Author" }] : []),
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created On" },
    { id: "actions", label: "Actions" },
  ];

  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// toolbar
function EnhancedTableToolbar({ numSelected, onDeleteSelected }) {
  return (
    <Toolbar>
      {numSelected > 0 ? (
        <Typography sx={{ flex: 1 }} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: 1 }} variant="h6">
          Articles
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete selected">
          <IconButton onClick={onDeleteSelected}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

// main table component
export default function EnhancedTable({ articles, onRead, onEdit, onPublish, onApprove, onReject, onDelete, role }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const rows = articles;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const allIds = rows.map((r) => r._id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    const newSelected =
      selectedIndex === -1
        ? [...selected, id]
        : selected.filter((selId) => selId !== id);
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.includes(id);

  const handleDeleteSelected = async () => {
    for (const id of selected) {
      await onDelete(id);
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: 3,
          boxShadow: 4,
          overflow: "hidden",
        }}
      >
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDeleteSelected={handleDeleteSelected}
        />

        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={rows.length}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              role={role}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>

                      <TableCell>{row.numericId}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{row.title.length > 25 ? `${row.title.slice(0, 30)}...` : row.title}</TableCell>
                      <TableCell>{row.categoryId?.title}</TableCell>

                      {role === "admin" && (
                        <TableCell>{row.userId?.firstname} {row.userId?.lastname}</TableCell>
                      )}

                      <TableCell>
                        <Chip
                          label={row.status}
                          color={getStatusColor(row.status)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell align="right">
                        <Box
                          sx={{ display: 'flex', gap: 1 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {role === "admin" && (
                                <>
                                    {(row.status === "pending" ) && (
                                    <>
                                        <Tooltip title="Approve">
                                        <IconButton onClick={() => onApprove(row._id)} sx={{ color: '#2e7d32' }}>
                                            <FaCheck size={16} />
                                        </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Reject">
                                        <IconButton onClick={() => onReject(row._id)} sx={{ color: '#c62828' }}>
                                            <FaTimes size={16} />
                                        </IconButton>
                                        </Tooltip>
                                    </>
                                    )}
                                </>
                            )}
                            <Tooltip title="View">
                                <IconButton onClick={() => onRead(row)} sx={{ color: '#1976d2' }}>
                                   <FaEye size={16} />
                                </IconButton>
                            </Tooltip>

                            
                            {role === "member" && (
                                <>
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => onEdit(row)} sx={{ color: '#e39e1cff' }}>
                                            <FaEdit size={16} />
                                        </IconButton>
                                    </Tooltip>

                                    {(row.status === "draft" || row.status === "amended") && (
                                        <Tooltip title="Publish">
                                            <IconButton onClick={() => onPublish(row._id)} sx={{ color: '#0288d1' }}>
                                                <FaPaperPlane size={16} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </>
                            )}

                            <Tooltip title="Delete">
                                <IconButton onClick={() => onDelete(row._id)} sx={{ color: '#e53935' }}>
                                <FaTrash size={16} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

EnhancedTable.propTypes = {
  articles: PropTypes.array.isRequired,
  onRead: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPublish: PropTypes.func, 
  onApprove: PropTypes.func,  
  onReject: PropTypes.func,
  role: PropTypes.oneOf(["admin", "member"]).isRequired,
};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  role: PropTypes.oneOf(["admin", "member"]).isRequired,
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onDeleteSelected: PropTypes.func.isRequired,
};
