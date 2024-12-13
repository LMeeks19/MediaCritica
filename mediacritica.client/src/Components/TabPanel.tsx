function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

export default TabPanel;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
