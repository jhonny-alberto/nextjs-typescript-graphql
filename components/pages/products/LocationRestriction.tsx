import { Box } from 'rebass';
import { Transfer, Form } from 'antd';
import { useState } from 'react';
import { DataSrcType } from 'dsl-admin-base';

interface LocationRestrictionProps {
  dataSrc: DataSrcType[];
  defaultKeys: string[];
}

export const LocationRestriction: React.FC<LocationRestrictionProps> = ({
  defaultKeys,
  dataSrc,
}) => {
  const [keys, setKeys] = useState<string[]>(defaultKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    setSelectedKeys([...targetSelectedKeys, ...sourceSelectedKeys]);
  };

  return (
    <Box>
      <Form.Item style={{ marginBottom: 0 }} name="postcodeRestriction" initialValue={defaultKeys}>
        <Transfer
          showSearch
          dataSource={dataSrc}
          targetKeys={keys}
          onChange={setKeys}
          onSelectChange={handleSelectChange}
          selectedKeys={selectedKeys}
          pagination
          titles={['Choose Restriction Locations:', 'Location Restriction Applied:']}
          listStyle={{
            width: 350,
            height: 400,
          }}
          render={(item) => item.title}
          style={{ marginBottom: 16 }}
        />
      </Form.Item>
    </Box>
  );
};
