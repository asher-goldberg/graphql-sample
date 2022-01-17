const { TestWatcher } = require("jest");
const PropertiesAPI = require("../../datasources/properties");

describe ( 'datasources/properties.js', () => {
    const mockRESTDataSource = jest.fn().mockReturnValue(
        {
            listingId: '1234',
            listPrice: 100,
            property: {
                stories: 1
            }
        },
        {
            listingId: '5678',
            listPrice: 200,
            property: {
                stories: 2
            }
        }
    );

    let propertiesAPI;
    let propertiesAPIInstance;

    beforeEach(() => {
        jest.mock('apollo-datasource-rest', () => {
            return {
                RestDataSource: function() {
                    this.get = mockRESTDataSource;
                }
            };
        });
    });

    describe('test requests', () => {
        test('getProperties', async () => {
            expect.hasAssertions();
            propertiesAPI = require('../../datasources/properties');
            propertiesAPIInstance = new PropertiesAPI();

            propertiesAPIInstance.get = jest.fn().mockReturnValue([
                {
                    listingId: '1234',
                    listPrice: 100,
                    property: {
                        stories: 1
                    }
                },
                {
                    listingId: '5678',
                    listPrice: 200,
                    property: {
                        stories: 2
                    }
                }
            ]);

            let properties = await propertiesAPIInstance.getProperties({});

            expect(propertiesAPIInstance.get).toHaveBeenCalledTimes(1);
            expect(properties).toEqual([
                {
                    listingId: '1234',
                    listPrice: 100,
                    property: {
                        stories: 1
                    }
                },
                {
                    listingId: '5678',
                    listPrice: 200,
                    property: {
                        stories: 2
                    }
                }
            ]);
        })
    })
})