import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  SelectProps,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { CreateFormDrawer, GrowableInputList, NumberInput } from "@daed/components";
import { graphql } from "@daed/schemas/gql";
import { InterfacesQuery } from "@daed/schemas/gql/graphql";
import { useQuery } from "@tanstack/react-query";

export type FormValues = {
  name: string;
  global: {
    tproxyPort: number;
    logLevelIndex: number;
    tcpCheckUrl: string;
    udpCheckDns: string;
    checkIntervalSeconds: number;
    checkTolerenceMS: number;
    lanInterface: string[];
    wanInterface: string[];
    allowInsecure: boolean;
    dialMode: string;
  };
  dns: string;
  routing: string;
};

const SelectInterface = forwardRef<HTMLSelectElement, { data?: InterfacesQuery } & SelectProps>(
  ({ data, ...props }, forwardedRef) => (
    <Select ref={forwardedRef} {...props}>
      {data?.general.interfaces
        .filter(({ name }) => name !== "lo")
        .map(({ name }) => (
          <option key={name}>{name}</option>
        ))}
    </Select>
  )
);

export const CreateConfigFormDrawer = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: UseFormReturn<FormValues>) => Promise<void>;
}) => {
  const { t } = useTranslation();

  const form = useForm<FormValues>();
  const { register, control } = form;

  const LOG_LEVEL_STEPS = GET_LOG_LEVEL_STEPS(t);

  const interfacesQuery = useQuery(QUERY_KEY_INTERFACES, async () =>
    gqlClient.request(
      graphql(`
        query Interfaces {
          general {
            interfaces {
              name
            }
          }
        }
      `)
    )
  );

  return (
    <CreateFormDrawer<FormValues>
      header={t("config")}
      isOpen={isOpen}
      onClose={onClose}
      form={form}
      onSubmit={onSubmit}
    >
      <Tabs>
        <TabList>
          <Tab>{t("global")}</Tab>
          <Tab>{t("dns")}</Tab>
          <Tab>{t("routing")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex direction="column" gap={4}>
              <FormControl>
                <FormLabel>{t("name")}</FormLabel>

                <Input {...register("name")} />
              </FormControl>

              <FormControl>
                <FormLabel>{t("tproxyPort")}</FormLabel>

                <Controller
                  name="global.tproxyPort"
                  control={control}
                  defaultValue={12345}
                  render={({ field }) => <NumberInput min={0} max={65535} {...field} />}
                />
              </FormControl>

              <FormControl pb={4}>
                <FormLabel>{t("logLevel")}</FormLabel>

                <Controller
                  name="global.logLevelIndex"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <Box px={4} textAlign="center">
                      <Slider max={LOG_LEVEL_STEPS.length - 1} {...field}>
                        <Fragment>
                          {LOG_LEVEL_STEPS.map(([name], i) => (
                            <SliderMark key={i} mt={4} ml="-50%" w="full" fontSize="sm" value={i}>
                              {name}
                            </SliderMark>
                          ))}
                        </Fragment>

                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>

                        <SliderThumb />
                      </Slider>
                    </Box>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t("tcpCheckUrl")}</FormLabel>

                <Input defaultValue={DEFAULT_TCP_CHECK_URL} {...register("global.tcpCheckUrl")} />
              </FormControl>

              <FormControl>
                <FormLabel>{t("udpCheckDns")}</FormLabel>

                <Input defaultValue={DEFAULT_UDP_CHECK_DNS} {...register("global.udpCheckDns")} />
              </FormControl>

              <FormControl>
                <FormLabel>{`${t("checkInterval")} (${t("seconds")})`}</FormLabel>

                <Controller
                  name="global.checkIntervalSeconds"
                  control={control}
                  defaultValue={10}
                  render={({ field }) => <NumberInput min={0} {...field} />}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{`${t("checkTolerance")} (${t("milliseconds")})`}</FormLabel>

                <Controller
                  name="global.checkTolerenceMS"
                  control={control}
                  defaultValue={1000}
                  render={({ field }) => <NumberInput min={0} {...field} />}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t("lanInterface")}</FormLabel>

                <GrowableInputList>
                  {(i) => <SelectInterface data={interfacesQuery.data} {...register(`global.lanInterface.${i}`)} />}
                </GrowableInputList>
              </FormControl>

              <FormControl>
                <FormLabel>{t("wanInterface")}</FormLabel>

                <GrowableInputList>
                  {(i) => (
                    <SelectInterface
                      defaultValue={
                        interfacesQuery.data?.general.interfaces[interfacesQuery.data?.general.interfaces.length - 1]
                          .name
                      }
                      data={interfacesQuery.data}
                      {...register(`global.wanInterface.${i}`)}
                    />
                  )}
                </GrowableInputList>
              </FormControl>

              <FormControl>
                <FormLabel>{t("dialMode")}</FormLabel>

                <Select {...register("global.dialMode")}>
                  <option value="ip">{t("ip")}</option>
                  <option value="domain">{t("domain")}</option>
                  <option value="domain+">{t("domain+")}</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>{t("allowInsecure")}</FormLabel>

                <Switch {...register("global.allowInsecure")} />
              </FormControl>
            </Flex>
          </TabPanel>

          <TabPanel>
            <Textarea {...register("dns")} />
          </TabPanel>

          <TabPanel>
            <Textarea {...register("routing")} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </CreateFormDrawer>
  );
};
