import { forwardRef } from "react";
import { IconChevronDown, IconExternalLink } from "@tabler/icons";
import { Group, Avatar, Text, Menu, UnstyledButton } from "@mantine/core";

const UserButton = forwardRef(
    ({ image, name, email, icon, ...others }, ref) => (
        <UnstyledButton
            ref={ref}
            sx={(theme) => ({
                display: "block",
                width: "100%",
                padding: theme.spacing.xs,
                color:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[0]
                        : theme.black,

                "&:hover": {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[6]
                            : theme.colors.gray[0],
                },
            })}
            {...others}
        >
            <Group>
                <Avatar src={image} radius="xl" size="sm" />

                <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {name}
                    </Text>
                </div>

                {icon || <IconChevronDown size="1rem" />}
            </Group>
        </UnstyledButton>
    )
);

const UserMenu = ({ image, name, email }) => {
    return (
        <Group position="center">
            <Menu withArrow>
                <Menu.Target>
                    <UserButton image={image} name={name} email={email} />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item component="a" href="https://mantine.dev">
                        Mantine website
                    </Menu.Item>

                    <Menu.Item
                        icon={<IconExternalLink size={14} />}
                        component="a"
                        href="https://mantine.dev"
                        target="_blank"
                    >
                        External link
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Group>
    );
};

export default UserMenu;
