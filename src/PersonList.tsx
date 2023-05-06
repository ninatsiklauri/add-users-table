import React from 'react';
import { Table, Modal, Button, Form, Input, Select } from 'antd';
import { create } from 'zustand';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';

interface Address {
  street: string;
  city: string;
}

interface Person {
  id: number;
  name: string;
  email: string;
  gender: string;
  address: Address
  phone: string;
}

interface PersonStore {
  persons: Person[];
  fetchPersons: () => Promise<void>;
  addPerson: (person: Person) => void;
    deletePerson: (id: number) => void;

}

const usePersonStore = create<PersonStore>((set) => ({
    persons: [],
  
    fetchPersons: async () => {
      try {
        const response = await axios.get('https://nodejs-production-9969.up.railway.app/');
        set({ persons: response.data });
      } catch (error) {
        console.error(error);
      }
    },
  
    addPerson: (person: Person) => {
        set((state) => ({
          persons: [...state.persons, person],
        }));
    },
    
    
  
    deletePerson: async (id: number) => {
      try {
        await axios.delete(`https://nodejs-production-9969.up.railway.app/${id}`);
        set((state) => ({
          persons: state.persons.filter((person) => person.id !== id),
        }));
      } catch (error) {
        console.error(error);
      }
    },
    
  }));

function App() {
    const [isVisible, setIsVisible] = useState(false);
    const [form] = Form.useForm();
    const fetchPersons = usePersonStore((state) => state.fetchPersons);
    const addPerson = usePersonStore((state) => state.addPerson);


    const persons = usePersonStore((state) => {
        return state.persons
    });
  

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons, persons]);


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Street',
      dataIndex: ['address', 'street'],
    },
    {
      title: 'City',
      dataIndex: ['address', 'city'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Action',
      dataIndex: 'action',
        render: (_: any, record: any) => (
        <>
            <DeleteOutlined   
                key={record.id}
                onClick={() => {
                    usePersonStore.getState().deletePerson(record.id);
                }}
            style={{ color: 'red' }}
          />
        </>
        ),
    },
  ];


const tableProps = {
    dataSource: persons,
    columns: columns,
    rowKey: 'id',
    
};

  const handleAdd = () => {
    setIsVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
        const newPerson = {
        name: values.name,
        email: values.email,
        gender: values.gender,
        address: {
          street: values.street,
          city: values.city
        },
        phone: values.phone,
      };
  
      axios.post(`https://nodejs-production-9969.up.railway.app/`, newPerson)
          .then((response) => {
              addPerson(response.data);
              setIsVisible(false);
              form.resetFields();
          })
          .catch((error) => {
              console.error(error);
          });
      });
    };
   

    
    return (
      
        <div className='app'>
            
      <Button style={{ marginTop: '40px', margin: '10px 0 10px 10px' }} onClick={handleAdd}>
        add new user
      </Button>
      <Table {...tableProps}  />
      <Modal
        title="Add new user"
        visible={isVisible}
        onCancel={() => setIsVisible(false)}
        onOk={handleSave}
        >
        <Form form={form}>
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Please enter email' }]}
          >
            <Input type='email' />
          </Form.Item>
          <Form.Item
            label='Gender'
            name='gender'
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select>
              <Select.Option value='male'>Male</Select.Option>
              <Select.Option value='female'>Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label='Street' name='street' rules={[{ required: true, message: 'Please enter street' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='City' name='city' rules={[{ required: true, message: 'Please enter city' }]}>
            <Input />
            </Form.Item>
              <Form.Item label='Phone' name='phone' rules={[{ required: true, message: 'Please enter phone number' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default App; 


