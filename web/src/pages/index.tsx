import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import { Pagination } from "react-bootstrap";
import {Alert, Container} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number,
  data: {
    data: TUserItem[],
    page: number,
    size: number,
    total: number
  }
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const { page = 1 } = ctx.query;
    const fetchQueryString = page ? `?page=${page}` : '';

    const res = await fetch(`http://localhost:3000/users${fetchQueryString}`, {method: 'GET'});
    if (!res.ok) {
      return {props: {statusCode: res.status, data: {data: [], page: 0, size: 0, total: 0}}}
    }
    const parsedData = await res.json();
    return {
      props: {statusCode: 200, data: {
        data: parsedData.data,
        page: parseInt(parsedData.page),
        size: parseInt(parsedData.size),
        total: parseInt(parsedData.total),
      }}
    }
  } catch (e) {
    return {props: {statusCode: 500, data: {data: [], page: 0, size: 0, total: 0}}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, data}: TGetServerSideProps) {
  if (statusCode !== 200) {
    console.log('Error', statusCode, data)
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }
  
  const paginationItems = [];
  for (let i = Math.min(data.page, data.page - (10 - (data.total / 10 - data.page))); i <= Math.min(data.total / 10, data.page + 9); i++) {
    paginationItems.push(<Pagination.Item key={i} active={i == data.page} href={`/?page=${i}`}>{i}</Pagination.Item>);
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              data.data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First href="/?page=1" />
            <Pagination.Prev href={`/?page=${data.page - 1}`} />
            { paginationItems }
            <Pagination.Next href={`/?page=${data.page + 1}`} />
            <Pagination.Last href={`/?page=${data.total / 10}`} />
          </Pagination>

        </Container>
      </main>
    </>
  );
}
