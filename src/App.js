import React from 'react';
import styled from 'styled-components';
import {
  ResponsiveTable,
  Provider,
  Container,
} from '@actovos-consulting-group/ui-core';
import axios from 'axios';
import './App.css';

const Avatar = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
`;

const COLUMNS = [
  {
    Header: 'Avatar',
    accessor: 'avatar',

    Cell: ({ cell: { value } }) => <Avatar src={value} />,
    disableSortBy: true,
    columnWidth: '100px',
    minDisplayWidth: 900,
  },
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Company',
    accessor: 'company',
    disableSortBy: true,
  },
];

const App = ({ variant }) => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({});
  const [sorting, setSorting] = React.useState({
    sortBy: '',
    direction: '',
  });
  const tableData = React.useMemo(() => users, [loading]);
  const fetch = async (pageNumber) => {
    setLoading(true);
    const { sortBy, direction } = sorting;
    const {
      data: { data, pagination },
    } = await axios.get(
      `${process.env.REACT_API_URL}/users?limit=10&page=${pageNumber}&sortBy=${sortBy}&direction=${direction}`
    );
    setUsers(data);
    setPagination({
      pageSize: pagination.limit,
      pageIndex: pagination.current - 1,
      pageCount: pagination.total,
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const handlePageChange = (pageIndex) => {
    fetch(pageIndex + 1);
  };
  const handleSortChange = async (sortBy, direction) => {
    setSorting({ sortBy, direction });
  };
  React.useEffect(() => {
    fetch(1);
  }, [sorting.direction.length, sorting.sortBy]);
  return (
    <Provider isDarkMode>
      <Container>
        <h1>ACG User List</h1>
        <ResponsiveTable
          loading={loading}
          handlePageChange={handlePageChange}
          handleSortChange={handleSortChange}
          columns={COLUMNS}
          pagination={pagination}
          data={tableData}
          isSortable
          isPaginated
          variant={variant}
        />
      </Container>
    </Provider>
  );
};

export default App;
